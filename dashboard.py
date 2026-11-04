import streamlit as st
import pandas as pd
import plotly.express as px

# 1. Page Config (Title & Layout)
st.set_page_config(page_title="RiskGuard Python EDA", layout="wide", page_icon="🐍")
st.title("🐍 RiskGuard: Python Fraud Analytics Dashboard")
st.markdown("Deep Exploratory Data Analysis (EDA) of European Return Abusers & Scammers.")

# 2. Load Data
@st.cache_data
def load_data():
    return pd.read_csv('data/return_abusers_risk_list.csv')

df = load_data()

# 3. Sidebar Filters
st.sidebar.header("Filter Data")
status_filter = st.sidebar.multiselect("Select Status", options=df['status'].unique(), default=df['status'].unique())
country_filter = st.sidebar.multiselect("Select Country", options=df['country'].unique(), default=df['country'].unique())

# Filter Dataframe
filtered_df = df[(df['status'].isin(status_filter)) & (df['country'].isin(country_filter))]

# 4. Top KPI Metrics (Stats Cards)
col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Users Analyzed", len(filtered_df))
col2.metric("Safe Users", len(filtered_df[filtered_df['status'] == 'Safe']))
col3.metric("Total Banned/Blocked", len(filtered_df[filtered_df['status'].isin(['Banned', 'Blocked'])]))
col4.metric("Avg Risk Score", round(filtered_df['risk_score'].mean(), 1))

st.markdown("---")

# 5. Charts Section
col_chart1, col_chart2 = st.columns(2)

with col_chart1:
    st.subheader("Risk Distribution by Claim Type")
    fig1 = px.histogram(filtered_df, x="claim_type", color="status", barmode="group", 
                        color_discrete_map={'Safe':'green', 'Warning':'orange', 'Review':'blue', 'Blocked':'red', 'Banned':'darkred'})
    st.plotly_chart(fig1, use_container_width=True)

with col_chart2:
    st.subheader("Fraud Cases by European Country")
    # Sirf abusers filter karke country map banayein
    abusers_df = filtered_df[filtered_df['claim_type'] != 'None']
    fig2 = px.pie(abusers_df, names='country', values='risk_score', hole=0.4)
    st.plotly_chart(fig2, use_container_width=True)

# 6. Raw Data Table
st.subheader("📋 Raw Risk Data")
st.dataframe(filtered_df[['full_name', 'country', 'claim_type', 'risk_score', 'status']], use_container_width=True)