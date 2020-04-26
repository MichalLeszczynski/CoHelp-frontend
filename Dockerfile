FROM python:latest
COPY . .
EXPOSE 80
CMD python -m http.server 80