import mysql.connector

def get_connection():
    return mysql.connector.connect( 
        host="localhost",
        user="root",
        password="1234",
        database="sakila"
    )

# anhs portion
# query for top five films
def top_rented():
    conn = get_connection()
    cursor = conn.cursor() 
    cursor.execute("""
                   SELECT f.film_id, f.title, COUNT(r.rental_id) as rented
                    FROM rental as r
                    JOIN inventory as i on r.inventory_id = i.inventory_id
                    JOIN film as f on i.film_id = f.film_id
                    JOIN film_category as c on f.film_id = c.film_id
                    GROUP BY f.film_id, f.title
                    ORDER BY rented desc limit 5;
    """)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return result;

# jimmy's portion - search films
def search_films(query, search_type):
    conn = get_connection()
    cursor = conn.cursor()
    
    if search_type == 'film':
        cursor.execute("""
            SELECT DISTINCT f.film_id, f.title, f.release_year, f.rental_rate,
                   (SELECT COUNT(*) FROM inventory i 
                    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
                    WHERE i.film_id = f.film_id AND r.rental_id IS NULL) as available_copies
            FROM film f
            WHERE f.title LIKE %s
        """, (f'%{query}%',))
    elif search_type == 'actor':
        cursor.execute("""
            SELECT DISTINCT f.film_id, f.title, f.release_year, f.rental_rate,
                   (SELECT COUNT(*) FROM inventory i 
                    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
                    WHERE i.film_id = f.film_id AND r.rental_id IS NULL) as available_copies
            FROM film f
            JOIN film_actor fa ON f.film_id = fa.film_id
            JOIN actor a ON fa.actor_id = a.actor_id
            WHERE a.first_name LIKE %s OR a.last_name LIKE %s
        """, (f'%{query}%', f'%{query}%'))
    elif search_type == 'genre':
        cursor.execute("""
            SELECT DISTINCT f.film_id, f.title, f.release_year, f.rental_rate,
                   (SELECT COUNT(*) FROM inventory i 
                    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
                    WHERE i.film_id = f.film_id AND r.rental_id IS NULL) as available_copies
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON fc.category_id = c.category_id
            WHERE c.name LIKE %s
        """, (f'%{query}%',))
    
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

# jimmy's portion - get customers for rental
def get_customers():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT customer_id, first_name, last_name
        FROM customer
        ORDER BY last_name, first_name
    """)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

# jimmy's portion - create rental
def create_rental(film_id, customer_id):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT i.inventory_id 
        FROM inventory i
        LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
        WHERE i.film_id = %s AND r.rental_id IS NULL
        LIMIT 1
    """, (film_id,))
    inventory = cursor.fetchone()
    
    if not inventory:
        cursor.close()
        conn.close()
        return None
    
    cursor.execute("""
        INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
        VALUES (NOW(), %s, %s, 1)
    """, (inventory[0], customer_id))
    
    conn.commit()
    rental_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return rental_id

# query for top 5 films details
# shows film id, title, description, release year, actor name, language, length, rating, and special features
def rented_details(film_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT f.film_id, f.title, GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name) SEPARATOR ', ') AS actors,
                    f.description, f.release_year, l.name, f.length, f.rating
        FROM film f
        JOIN language l on l.language_id = f.language_id 
        JOIN film_actor fa on fa.film_id = f.film_id
        JOIN actor a on a.actor_id = fa.actor_id
        JOIN film_category fc on fc.film_id = f.film_id
        WHERE f.film_id = %s
        GROUP BY f.film_id, f.title, f.description, f.release_year, l.name, f.length, f.rating;
    """, (film_id,))
    
    result = cursor.fetchall() 
    cursor.close()
    conn.close()
    
    return result

# query for top actors based on rental amount
def top_actors():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
                   SELECT a.actor_id, a.first_name, a.last_name, COUNT(r.rental_id) as rented
                   FROM actor a
                   JOIN film_actor fa on a.actor_id = fa.actor_id
                   JOIN film f on fa.film_id = f.film_id
                   JOIN inventory i on f.film_id = i.film_id
                   JOIN rental r on i.inventory_id = r.inventory_id
                   GROUP BY a.actor_id, a.first_name, a.last_name
                   ORDER BY rented DESC limit 5;
    """)
    
    result = cursor.fetchall() 
    cursor.close()
    conn.close()
    
    return result;

# top 5 actors details and their top 5 most rented movies
def actor_details(actor_id):
        
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
                       SELECT a.actor_id, a.first_name, a.last_name, f.film_id, f.title, COUNT(r.rental_id) as rented
                       FROM actor a
                       JOIN film_actor fa on a.actor_id = fa.actor_id
                       JOIN film f on fa.film_id = f.film_id
                       JOIN inventory i on f.film_id = i.film_id
                       JOIN rental r on i.inventory_id = r.inventory_id
                       WHERE a.actor_id = %s
                       GROUP BY a.actor_id, a.first_name, a.last_name, f.film_id, f.title
                       ORDER BY rented desc limit 5;
                       
    """, (actor_id,))
    
        result = cursor.fetchall() 
        cursor.close()
        conn.close()

        return result;
