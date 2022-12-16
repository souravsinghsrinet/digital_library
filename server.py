import psycopg2
import mysql.connector as mysql_con
from typing import List

from pydantic import BaseModel

import uvicorn
from fastapi import FastAPI, status

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Book(BaseModel):
    id: int = None
    volume_id: str
    title: str
    authors: str = None
    thumbnail: str = None
    state: int
    rating: int = None


class UpdateRatingRequestBody(BaseModel):
    volume_id: str
    new_rating: int


class UpdateStateRequestBody(BaseModel):
    volume_id: str
    new_state: int


@app.get("/books", response_model=List[Book], status_code=status.HTTP_200_OK)
async def get_books():
    # Establish db connection
    # conn = psycopg2.connect(database="exampledb", user="postgres", password="Po$tgre$", host="localhost", port=5433)
    conn = mysql_con.connect(database="exampledb", user="root", password="Po$tgre$", host="localhost", port=3306)
    cur = conn.cursor()
    cur.execute("Select * from book")
    rows = cur.fetchall()
    formatted_books = []
    for row in rows:
        formatted_books.append(
            Book(
                id=row[0],
                volume_id=row[1],
                title=row[2],
                authors=row[3],
                thumbnail=row[4],
                state=row[5],
                rating=row[6]
            )
        )
    cur.close()
    conn.close()
    return formatted_books


@app.post("/books", status_code=status.HTTP_201_CREATED)
async def new_book(book: Book):
    # conn = psycopg2.connect(database="exampledb", user="postgres", password="Po$tgre$", host="localhost", port=5433)
    conn = mysql_con.connect(database="exampledb", user="root", password="Po$tgre$", host="localhost", port=3306)
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO book (volume_id, title, authors, thumbnail, state) "
        f"""VALUES ('{book.volume_id}','{book.title.replace("'","''")}',"""
        f"""'{book.authors.replace("'","''")}','{book.thumbnail}','{book.state}')""")
    cur.close()
    conn.commit()
    conn.close()
    return


@app.put("/books/update_rating", status_code=status.HTTP_200_OK)
async def update_rating(update_rating_body: UpdateRatingRequestBody):
    # conn = psycopg2.connect(database="exampledb", user="postgres", password="Po$tgre$", host="localhost", port=5433)
    conn = mysql_con.connect(database="exampledb", user="root", password="Po$tgre$", host="localhost", port=3306)
    cur = conn.cursor()
    cur.execute(
        f"UPDATE book SET rating={update_rating_body.new_rating} "
        f"WHERE volume_id='{update_rating_body.volume_id}'"
    )
    cur.close()
    conn.commit()
    conn.close()
    return


@app.put("/books/update_state", status_code=status.HTTP_200_OK)
async def update_state(update_state_body: UpdateStateRequestBody):
    # conn = psycopg2.connect(database="exampledb", user="postgres", password="Po$tgre$", host="localhost", port=5433)
    conn = mysql_con.connect(database="exampledb", user="root", password="Po$tgre$", host="localhost", port=3306)
    cur = conn.cursor()
    cur.execute(
        f"UPDATE book SET state={update_state_body.new_state} "
        f"WHERE volume_id='{update_state_body.volume_id}'"
    )
    cur.close()
    conn.commit()
    conn.close()
    return

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

