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
        SELECT f.film_id, f.title, COUNT(r.rental_id) AS rental_count
        FROM film f
        JOIN inventory i ON f.film_id = i.film_id
        JOIN rental r ON i.inventory_id = r.inventory_id
        GROUP BY f.film_id
        ORDER BY rental_count DESC
        LIMIT 5;
    """)
    result = cursor.fetchall() # gets all result from database as tuples
    cursor.close()
    conn.close()
    
    return result;

# query for top 5 films details
# shows film id, title, description, release year, actor name, and language
def rented_details():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT f.film_id, f.title, f.description, f.release_year, GROUP_CONCAT(CONCAT(a.first_name, ' ', a.last_name)) as actor, l.name
        FROM film f
        JOIN language l on l.language_id = f.language_id 
        JOIN film_actor fa on fa.film_id = f.film_id
        JOIN actor a on a.actor_id = fa.actor_id
        JOIN film_category fc on fc.film_id = f.film_id
        WHERE f.film_id = %s
        GROUP BY f.film_id, f.title, f.description, f.release_year, l.name;
    """, (film_id,))
    
    result = cursor.fetchone() #gets just one result
    cursor.close()
    conn.close()
    
    return result;

# query for top actors based on rental amount
#def top_actors():

    
# top 5 actors details
#def actors_details():
