from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from sakiladb import top_rented
from sakiladb import top_actors
from sakiladb import rented_details
from sakiladb import actor_details
from sakiladb import search_films
from sakiladb import get_customers
from sakiladb import create_rental
from sakiladb import filter_customer
from sakiladb import customer_details
from sakiladb import returned_movie
from sakiladb import customer_rentals

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

@app.route("/topfilms/<int:film_id>") # shows film id, title, description, release year, actor name, language and rating
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

@app.route("/topactors/<int:actor_id>")
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

@app.route("/films/search")
def filmsearch():
    query = request.args.get('query', '')
    search_type = request.args.get('type', 'film')
    
    films = search_films(query, search_type)
    results = []
    for f in films:
        results.append({
            "film_id": f[0],
            "title": f[1],
            "release_year": f[2],
            "rental_rate": f[3],
            "available_copies": f[4]
        })
    return jsonify(results)

@app.route("/customers")
def customers():
    custs = get_customers()
    results = []
    for c in custs:
        results.append({
            "customer_id": c[0],
            "first_name": c[1],
            "last_name": c[2]
        })
    return jsonify(results)

@app.route("/rentals", methods=['POST'])
def rentals():
    data = request.get_json()
    film_id = data.get('film_id')
    customer_id = data.get('customer_id')
    
    rental_id = create_rental(film_id, customer_id)
    
    if rental_id:
        return jsonify({"rental_id": rental_id, "message": "Rental created successfully"})
    else:
        return jsonify({"error": "No inventory available"}), 404

@app.route("/customer_search/search")
def customersearch():
    query = request.args.get('query', '')
    search_type = request.args.get('type', '')
    
    customer = filter_customer(query, search_type)
    results = []
    for f in customer:
        results.append({
            "customer_id": f[0],
            "first_name": f[1],
            "last_name": f[2],
            "active": f[3]
        })
    return jsonify(results)

@app.route("/customer_search/<int:customer_id>")
def customerdetails(customer_id):
    rows = customer_details(customer_id)
    a=rows[0]
    customer_info = {
            "customer_id": a[0],
            "first_name": a[1],
            "last_name": a[2],
            "email": a[3]
    }
    rentals = customer_rentals(customer_id)
    customer_info["rentals"] = [{
        "film_id": r[0],
        "title": r[1],
        "rental_date":r[2].isoformat() if r[2] else None,
        "return_date": r[3].isoformat() if r[3] else None
    } for r in rentals
    ]
    return jsonify(customer_info)

if __name__ == "__main__":
    app.run(debug=True)