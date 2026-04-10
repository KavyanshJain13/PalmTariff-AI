import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
from tensorflow.keras.callbacks import EarlyStopping

# =========================
# LOAD DATA
# =========================
FILE = "india_cpo_clean_ml_dataset_gen11.csv"   # <-- put your GEN11 file name here
df = pd.read_csv(FILE)

# =========================
# FEATURE SET (ECONOMICALLY VALID)
# =========================
FEATURES = [
    "year", "month",
    "tariff_pct", "tariff_change_pct", "tariff_shock",
    "tariff_3m_avg", "tariff_6m_avg",
    "global_cpo_price_usd_per_tonne", "usd_inr", "freight_usd",
    "domestic_consumption_tonnes", "domestic_production_tonnes",
    "demand_supply_gap",
    "imports_tonnes_lag1", "imports_tonnes_lag3", "imports_tonnes_lag6",
    "import_parity_cost_inr", "tax_component_inr",
    "farm_cost_floor_inr",
    "farmer_margin_over_floor",
    "farmer_margin_pct_of_floor"
]

TARGET = "farmer_price_inr_per_tonne"

df = df.dropna(subset=FEATURES + [TARGET]).reset_index(drop=True)

X = df[FEATURES]
y = df[TARGET]

# =========================
# TIME-BASED SPLIT (80/20)
# =========================
split = int(len(df) * 0.8)
X_train, X_test = X.iloc[:split], X.iloc[split:]
y_train, y_test = y.iloc[:split], y.iloc[split:]

# ======================================================
# 1️⃣ XGBOOST MODEL
# ======================================================
print("\n===== XGBOOST → FARMER PRICE =====")

xgb_model = xgb.XGBRegressor(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="reg:squarederror",
    random_state=42
)

xgb_model.fit(X_train, y_train)

xgb_preds = xgb_model.predict(X_test)

r2_xgb = r2_score(y_test, xgb_preds)
rmse_xgb = np.sqrt(mean_squared_error(y_test, xgb_preds))
mae_xgb = mean_absolute_error(y_test, xgb_preds)

print("R²  :", r2_xgb)
print("RMSE:", rmse_xgb)
print("MAE :", mae_xgb)

joblib.dump(xgb_model, "xgb_farmer_price_gen11.pkl")

# ======================================================
# 2️⃣ RANDOM FOREST MODEL
# ======================================================
print("\n===== RANDOM FOREST → FARMER PRICE =====")

scaler_rf = StandardScaler()
X_train_rf = scaler_rf.fit_transform(X_train)
X_test_rf  = scaler_rf.transform(X_test)

rf_model = RandomForestRegressor(
    n_estimators=600,
    max_depth=14,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1,
    oob_score=True
)

rf_model.fit(X_train_rf, y_train)

rf_preds = rf_model.predict(X_test_rf)

r2_rf = r2_score(y_test, rf_preds)
rmse_rf = np.sqrt(mean_squared_error(y_test, rf_preds))
mae_rf = mean_absolute_error(y_test, rf_preds)

print("R²  :", r2_rf)
print("RMSE:", rmse_rf)
print("MAE :", mae_rf)
print("OOB :", rf_model.oob_score_)

joblib.dump(
    {"model": rf_model, "scaler": scaler_rf},
    "rf_farmer_price_gen11.pkl"
)

# ======================================================
# 3️⃣ LSTM MODEL (SEQUENCE = 12 MONTHS)
# ======================================================
print("\n===== LSTM → FARMER PRICE =====")

scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_X.fit_transform(X)
y_scaled = scaler_y.fit_transform(y.values.reshape(-1, 1))

SEQ = 12
X_seq, y_seq = [], []

for i in range(len(X_scaled) - SEQ):
    X_seq.append(X_scaled[i:i+SEQ])
    y_seq.append(y_scaled[i+SEQ])

X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

split_seq = int(len(X_seq) * 0.8)
X_train_seq, X_test_seq = X_seq[:split_seq], X_seq[split_seq:]
y_train_seq, y_test_seq = y_seq[:split_seq], y_seq[split_seq:]

model = Sequential([
    Input(shape=(SEQ, X_seq.shape[2])),
    LSTM(64, return_sequences=True),
    LSTM(32),
    Dense(1)
])

model.compile(optimizer="adam", loss="mse")

es = EarlyStopping(patience=12, restore_best_weights=True)

model.fit(
    X_train_seq, y_train_seq,
    epochs=120,
    batch_size=16,
    validation_data=(X_test_seq, y_test_seq),
    callbacks=[es],
    verbose=1
)

lstm_preds_scaled = model.predict(X_test_seq)
lstm_preds = scaler_y.inverse_transform(lstm_preds_scaled)
y_test_real = scaler_y.inverse_transform(y_test_seq)

r2_lstm = r2_score(y_test_real, lstm_preds)
rmse_lstm = np.sqrt(mean_squared_error(y_test_real, lstm_preds))
mae_lstm = mean_absolute_error(y_test_real, lstm_preds)

print("\n===== LSTM PERFORMANCE =====")
print("R²  :", r2_lstm)
print("RMSE:", rmse_lstm)
print("MAE :", mae_lstm)

model.save("lstm_farmer_price_gen11.keras")
joblib.dump(scaler_X, "lstm_farmer_X_scaler.pkl")
joblib.dump(scaler_y, "lstm_farmer_y_scaler.pkl")

print("\n✅ ALL 3 FARMER PRICE MODELS TRAINED & SAVED")
