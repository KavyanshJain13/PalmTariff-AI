import pandas as pd

# ==============================
# CONFIG
# ==============================
INPUT_FILE = "india_cpo_ml_lstm_delta_targets_with_lags(gen10).csv"
OUTPUT_FILE = "india_cpo_clean_ml_dataset_gen11.csv"

# ==============================
# LOAD DATA
# ==============================
df = pd.read_csv(INPUT_FILE)
print("✅ Loaded:", df.shape)

# ==============================
# FEATURE ENGINEERING (ECONOMICALLY VALID)
# ==============================

# Import parity cost (₹)
df["import_parity_cost_inr"] = (
    df["global_cpo_price_usd_per_tonne"] + df["freight_usd"]
) * df["usd_inr"]

# Tariff-based tax component (₹)
df["tax_component_inr"] = df["import_parity_cost_inr"] * (df["tariff_pct"] / 100.0)

# Synthetic farm cost floor (75% of import parity)
df["farm_cost_floor_inr"] = df["import_parity_cost_inr"] * 0.75

# Farmer margin over cost floor
df["farmer_margin_over_floor"] = (
    df["farmer_price_inr_per_tonne"] - df["farm_cost_floor_inr"]
)

# Farmer margin percentage
df["farmer_margin_pct_of_floor"] = (
    df["farmer_margin_over_floor"] / df["farm_cost_floor_inr"]
)

print("✅ Engineered economic features added")

# ==============================
# SAFE ECONOMIC FEATURES (NO LEAKAGE)
# ==============================
FEATURES = [
    "year", "month",

    # Tariff signals
    "tariff_pct",
    "tariff_change_pct",
    "tariff_shock",
    "tariff_3m_avg",
    "tariff_6m_avg",

    # Global drivers
    "global_cpo_price_usd_per_tonne",
    "usd_inr",
    "freight_usd",

    # Domestic structure
    "domestic_consumption_tonnes",
    "domestic_production_tonnes",
    "demand_supply_gap",

    # Import memory
    "imports_tonnes_lag1",
    "imports_tonnes_lag3",
    "imports_tonnes_lag6",

    # ✅ Newly added engineered features
    "import_parity_cost_inr",
    "tax_component_inr",
    "farm_cost_floor_inr",
    "farmer_margin_over_floor",
    "farmer_margin_pct_of_floor"
]

# ==============================
# CLEAN TARGETS
# ==============================
TARGETS = [
    "imports_tonnes",
    "farmer_price_inr_per_tonne"
]

# ==============================
# SAFETY CHECK FOR MISSING COLUMNS
# ==============================
missing_cols = [c for c in FEATURES + TARGETS if c not in df.columns]
if missing_cols:
    raise ValueError(f"❌ Missing required columns: {missing_cols}")

# ==============================
# CREATE CLEAN DATASET
# ==============================
df_clean = df[FEATURES + TARGETS].copy()

# Remove NaNs (lags + new ratios)
df_clean = df_clean.dropna().reset_index(drop=True)

# ==============================
# SAVE CLEAN FILE
# ==============================
df_clean.to_csv(OUTPUT_FILE, index=False)

# ==============================
# SUMMARY
# ==============================
print("\n🎯 CLEAN DATASET CREATED!")
print("Shape:", df_clean.shape)
print("Saved as:", OUTPUT_FILE)
print("\nColumns:")
for col in df_clean.columns:
    print(" -", col)
