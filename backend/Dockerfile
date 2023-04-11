FROM python:3.9.2

WORKDIR /app

COPY . /app

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 5001

ENV FLASK_APP=app.py

# CMD python3 app2.py
CMD flask run --host 0.0.0.0 --port=5001
