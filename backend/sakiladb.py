import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="cs490",
        database="sakila"
    )

# anhs portion
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
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [{"film_id": r[0], "title": r[1], "rental_count": r[2]} for r in results]

# def rented_details():


# def top_actors():
    

# def actors_details():
