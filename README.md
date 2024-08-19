# Overview
This script is designed to perform load testing using k6. The script simulates multiple virtual users (VUs) to create natural users. The goal of the test is to reach and verify the rate limit.

# How to Run

### Local execution

- Clone the project
- Install k6 (Mac)

  
  ```
  brew install k6
  ```
- Populate the Keys and URL's  (BaseURL, clientId, authURL)
- Run the script

```
k6 run rateLimit.js
```

### Run in the cloud
In order to run in the cloud, you need a Grafana account and a user key

```
k6 run --out=cloud rateLimit.js
```

# Results 
Local execution 

![image](https://github.com/user-attachments/assets/bf1b14c9-b841-4ae3-bc27-ba59996cb64b)


Cloud 

![image](https://github.com/user-attachments/assets/343081e7-d1ba-4e77-9939-ba25993532bd)


# Future Work
- Store and retrieve the URL and variables safely
- For CI/CD Grafana and Influx DB can be dockerized
