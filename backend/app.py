from flask import Flask, render_template, jsonify
from flask_cors import CORS
from sakiladb import top_rented
from sakiladb import top_actors
from sakiladb import rented_details
from sakiladb import actor_details

app = Flask(__name__)
CORS(app)

@app.route("/topfilms") # top films page
def topfilms():
    films = top_rented()
    results = []
    for f in films:
        results.append({
            "film_id": f[0],
            "title": f[1]
        })

    return jsonify(results)

@app.route("/topactors") # top actors page
def topactors():
        
    actors = top_actors()
    results = []
    for a in actors:
        results.append({
            "actor_id": a[0],
            "first_name": a[1],
            "last_name": a[2]
        })
    return jsonify(results)

@app.route("/topfilms/<int:film_id>") # shows film id, title, description, release year, actor name, and language
def filmdetails(film_id):
    f_details = rented_details(film_id)
    results = []
    for f in f_details:
        results.append({
            "film_id": f[0],
            "title": f[1],
            "actor": [{"first_name": name.split()[0], "last_name": " ".join(name.split()[1:])} for name in f[2].split(", ")],
            "description": f[3],
            "release_year": f[4],
            "language": f[5],
            "length": f[6], 
            "rating": f[7],

        })
    return jsonify(results)

@app.route("/topactors/<int:actor_id>") # shows name and most rented films
def actordetails(actor_id):
    a_detail = actor_details(actor_id)
    results = []
    for a in a_detail:
        results.append({
            "actor_id": a[0],
            "first_name": a[1],
            "last_name": a[2],
            "film_id": a[3],
            "title": a[4],
            "rented": a[5]
        })
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)