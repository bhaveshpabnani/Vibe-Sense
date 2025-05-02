import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.metrics import silhouette_score
import tensorflow as tf
from tensorflow.keras.layers import Dense, Input
from tensorflow.keras.models import Model
import warnings
warnings.filterwarnings('ignore')

class EmployeeRiskAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=0.95)  # Preserve 95% variance
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        
    def engineer_features(self, df):
        """Advanced feature engineering with temporal and behavioral patterns"""
        
        # Communication patterns
        df['comm_diversity'] = df.apply(
            lambda x: entropy([
                x['Teams_Messages_Sent'],
                x['Emails_Sent'],
                x['Meetings_Attended']
            ]), axis=1
        )
        
        # Work-life balance indicators
        df['work_intensity'] = df['Work_Hours'] / (20 - df['Leave_Days'])
        df['engagement_consistency'] = df['Has_Response'] / df['Has_Activity']
        
        # Performance-effort alignment
        df['effort_score'] = (
            0.4 * df['Work_Hours'] +
            0.3 * df['Total_Communications'] +
            0.3 * df['Has_Activity']
        )
        df['performance_gap'] = df['effort_score'] - df['Performance_Rating']
        
        # Recognition metrics
        df['recognition_ratio'] = df['Has_Award'] / df['Performance_Rating']
        
        # Vibe score patterns
        df['vibe_volatility'] = df.groupby('Employee_ID')['Vibe_Score'].transform('std')
        
        return df
    
    def detect_anomalies(self, features):
        """Multi-dimensional anomaly detection using Isolation Forest and Autoencoder"""
        
        # Isolation Forest detection
        iso_scores = self.anomaly_detector.fit_predict(features)
        
        # Autoencoder for complex pattern detection
        input_dim = features.shape[1]
        input_layer = Input(shape=(input_dim,))
        encoded = Dense(int(input_dim/2), activation='relu')(input_layer)
        encoded = Dense(int(input_dim/4), activation='relu')(encoded)
        decoded = Dense(int(input_dim/2), activation='relu')(encoded)
        decoded = Dense(input_dim, activation='sigmoid')(decoded)
        
        autoencoder = Model(input_layer, decoded)
        autoencoder.compile(optimizer='adam', loss='mse')
        
        # Train autoencoder
        autoencoder.fit(features, features, epochs=50, batch_size=32, verbose=0)
        
        # Get reconstruction error
        reconstructed = autoencoder.predict(features)
        mse = np.mean(np.power(features - reconstructed, 2), axis=1)
        
        # Combine both scores
        final_anomaly_scores = (mse + (iso_scores == -1)) / 2
        return final_anomaly_scores
    
    def cluster_employees(self, features, n_clusters_range=range(2, 11)):
        """Dynamic clustering with optimal cluster selection"""
        
        # Find optimal number of clusters
        silhouette_scores = []
        for n_clusters in n_clusters_range:
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            cluster_labels = kmeans.fit_predict(features)
            score = silhouette_score(features, cluster_labels)
            silhouette_scores.append(score)
        
        optimal_clusters = n_clusters_range[np.argmax(silhouette_scores)]
        
        # Perform final clustering
        kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
        return kmeans.fit_predict(features)
    
    def calculate_risk_weights(self, df, target_col='Performance_Rating'):
        """Calculate data-driven risk weights using Random Forest feature importance"""
        
        feature_cols = [
            'comm_diversity', 'work_intensity', 'engagement_consistency',
            'performance_gap', 'recognition_ratio', 'vibe_volatility'
        ]
        
        # Create binary target (low performers vs others)
        target = (df[target_col] < df[target_col].median()).astype(int)
        
        # Train Random Forest
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(df[feature_cols], target)
        
        # Get feature importance as weights
        weights = dict(zip(feature_cols, rf.feature_importances_))
        return weights
    
    def identify_at_risk_employees(self, df):
        """Main method to identify employees at risk"""
        
        # 1. Feature engineering
        df = self.engineer_features(df)
        
        # 2. Prepare features for analysis
        feature_cols = [
            'comm_diversity', 'work_intensity', 'engagement_consistency',
            'performance_gap', 'recognition_ratio', 'vibe_volatility'
        ]
        features = self.scaler.fit_transform(df[feature_cols])
        
        # 3. Dimensionality reduction
        reduced_features = self.pca.fit_transform(features)
        
        # 4. Anomaly detection
        anomaly_scores = self.detect_anomalies(reduced_features)
        
        # 5. Employee clustering
        cluster_labels = self.cluster_employees(reduced_features)
        
        # 6. Calculate risk weights
        risk_weights = self.calculate_risk_weights(df)
        
        # 7. Calculate final risk score
        df['risk_score'] = np.zeros(len(df))
        for feature, weight in risk_weights.items():
            df['risk_score'] += df[feature] * weight
        
        # 8. Normalize risk scores
        df['risk_score'] = (df['risk_score'] - df['risk_score'].min()) / (df['risk_score'].max() - df['risk_score'].min())
        
        # 9. Combine with anomaly scores
        df['final_risk_score'] = 0.7 * df['risk_score'] + 0.3 * anomaly_scores
        
        # 10. Categorize risk levels
        df['risk_level'] = pd.qcut(
            df['final_risk_score'],
            q=4,
            labels=['Low', 'Moderate', 'High', 'Critical']
        )
        
        return df

def entropy(values):
    """Calculate entropy of a distribution"""
    values = np.array(values) + 1e-10  # Avoid log(0)
    distribution = values / np.sum(values)
    return -np.sum(distribution * np.log2(distribution))

if __name__ == "__main__":
    # Example usage
    analyzer = EmployeeRiskAnalyzer()
    df = pd.read_csv(file_path)
    numeric_cols = ['Has_Response', 'Vibe_Score', 'Has_Award', 'Has_Activity', 
                    'Teams_Messages_Sent', 'Emails_Sent', 'Meetings_Attended', 
                    'Work_Hours', 'Leave_Days', 'Promotion_Consideration', 'Performance_Rating']
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')
    results = analyzer.identify_at_risk_employees(df)
    results.to_csv("employee_risk_analysis_results.csv", index=False)
    print("Analysis complete. Results saved to employee_risk_analysis_results.csv") 