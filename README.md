\## 📁 ML Service Structure



The machine learning service is organized as follows:



```text

ml-service/

│

├── \_\_pycache\_\_/

│   ├── explain.cpython-314.pyc

│   ├── main.cpython-314.pyc

│   └── predict.cpython-314.pyc

│

├── models/

│   ├── cat\_features.joblib

│   ├── model\_expected.joblib

│   ├── model\_lower.joblib

│   ├── model\_upper.joblib

│   ├── num\_features.joblib

│   └── preprocessor.joblib

│

├── venv/

│   ├── Include/

│   ├── Lib/

│   ├── Scripts/

│   ├── .gitignore

│   └── pyvenv.cfg

│

├── analysis.txt

├── analyze\_data.py

├── explain.py

├── extract\_soil.py

├── main.py

├── predict.py

├── requirements.txt

└── train.py

