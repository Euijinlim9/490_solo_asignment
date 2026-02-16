from flask import Flask, render_template, jsonify
from flask_cors import CORS
from sakiladb import top_rented
from sakiladb import top_actors
from sakiladb import rented_details
from sakiladb import actor_details

app = Flask(__name__)
CORS(app)

@app.route("/")  # homepage
def home():
    films = top_rented()  # run query
    actors = top_actors()
    return render_template("index.html", films=films, actors=actors)  # pass results to HTML

@app.route("/topfilms")
def topfilms():
    films = top_rented()
    results = []
    for f in films:
        results.append({
            "film_id": f[0],
            "title": f[1]
        })

    return jsonify(results)

@app.route("/topactors")
def topactors():
    return jsonify(top_actors())

@app.route("/topfilms/<int:film_id>") # details page for films
def filmdetails(film_id):
    return jsonify(rented_details())

@app.route("/topactors/<int:actor_id>") # details page for actors
def actordetails(actor_id):
    return jsonify(actor_details())


if __name__ == "__main__":
    app.run(debug=True)