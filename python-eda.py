import pandas as pd

# 1. Load the CSV Data
df = pd.read_csv('data/return_abusers_risk_list.csv')

# 2. Basic EDA
print("--- BASIC DATA SUMMARY ---")
print(f"Total Customers: {len(df)}")
print(f"Total Columns: {len(df.columns)}")

# 3. Risk Status Breakdown
print("\n--- STATUS BREAKDOWN ---")
print(df['status'].value_counts())

# 4. Claim Type Breakdown
print("\n--- CLAIM TYPE BREAKDOWN ---")
print(df['claim_type'].value_counts())

# 5. Country-wise Fraud Analysis (Top 3)
print("\n--- HIGH RISK COUNTRIES ---")
high_risk = df[df['risk_score'] > 70]
print(high_risk['country'].value_counts().head(3))