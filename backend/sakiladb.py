import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="cs490",
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
    result = cursor.fetchall() # gets all result from database as tuples
    cursor.close()
    conn.close()
    
    return result;

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
