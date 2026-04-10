import pandas as pd

df = pd.read_csv("global_dataset.csv")

print("\n✅ SHAPE")
print(df.shape)

print("\n✅ COLUMNS")
print(df.columns.tolist())

print("\n✅ FIRST 5 ROWS")
print(df.head())

print("\n✅ LAST 5 ROWS")
print(df.tail())

print("\n✅ MISSING VALUES")
print(df.isna().sum())

print("\n✅ DATA TYPES")
print(df.dtypes)

print("\n✅ DATE RANGE")
if "date" in df.columns:
    print("From:", df["date"].min())
    print("To  :", df["date"].max())

print("\n✅ TARGET SUMMARY")
if "global_cpo_price_usd_per_tonne" in df.columns:
    print(df["global_cpo_price_usd_per_tonne"].describe())
