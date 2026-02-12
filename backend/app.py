from flask import Flask, render_template
from sakiladb import top_rented

app = Flask(__name__)

@app.route("/")  # homepage
def home():
    films = top_rented()  # run query
    return render_template("index.html", films=films)  # pass results to HTML

if __name__ == "__main__":
    app.run(debug=True)