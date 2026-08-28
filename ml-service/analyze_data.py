import pandas as pd
import json
import os
import sys

def analyze_dataset(file_path):
    print("Loading dataset...")
    df = pd.read_csv(file_path)
    
    print("Basic Info:")
    print(f"Row count: {len(df)}")
    print(f"Column count: {len(df.columns)}")
    print(f"Columns: {list(df.columns)}")
    
    print("\nData Types:")
    print(df.dtypes)
    
    print("\nMissing Value Percentage:")
    missing = (df.isnull().sum() / len(df)) * 100
    print(missing)
    
    print("\nUnique Value Counts:")
    unique_counts = df.nunique()
    print(unique_counts)
    
    print(f"\nDuplicate count: {df.duplicated().sum()}")
    
    # Check what columns we have
    print("\nSample Data (first 3 rows):")
    print(df.head(3).to_string())

if __name__ == "__main__":
    analyze_dataset("../data/training_ready_dataset.csv")
