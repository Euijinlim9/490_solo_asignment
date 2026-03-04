from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from sakiladb import top_rented
from sakiladb import top_actors
from sakiladb import rented_details
from sakiladb import actor_details
from sakiladb import search_films
from sakiladb import get_customers
from sakiladb import get_customers_paginated
from sakiladb import add_customer
from sakiladb import update_customer
from sakiladb import create_rental

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

@app.route("/customers/list")
def customers_list():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    custs, total = get_customers_paginated(page, per_page)
    results = []
    for c in custs:
        results.append({
            "customer_id": c[0],
            "first_name": c[1],
            "last_name": c[2],
            "email": c[3],
            "active": c[4]
        })
    
    return jsonify({
        "customers": results,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    })

@app.route("/customers/add", methods=['POST'])
def add_customer_route():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    address_id = data.get('address_id', 1)
    store_id = data.get('store_id', 1)
    
    customer_id = add_customer(first_name, last_name, email, address_id, store_id)
    
    return jsonify({"customer_id": customer_id, "message": "Customer added successfully"})

@app.route("/customers/update/<int:customer_id>", methods=['PUT'])
def update_customer_route(customer_id):
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    
    update_customer(customer_id, first_name, last_name, email)
    
    return jsonify({"message": "Customer updated successfully"})

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


if __name__ == "__main__":
    app.run(debug=True)