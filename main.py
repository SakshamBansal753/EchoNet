from textwrap import indent

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import  datetime
import random
import requests
import smtplib
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Float

DATA_FILE="Users.json"

def load_user():
    with open(DATA_FILE,'r') as f:
        return json.load(f)
app = Flask(__name__)
new_user={}
CORS(app)
@app.route("/api/create",methods=["GET","POST"])
def create_user():
    data = request.get_json()
    users = load_user()

    username = data["username"]
    if username in users:
        return jsonify({"error": "Username already exists"}), 400

    users[username] = {
        "Password": data["password"],
        "email": data["email"],
        "Total_Likes":0,
        "Total_Liked_TO": 0,
        "Profile": "https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg",
        "Bio": "Developer",
        "Posts": [],
        "UserName": username
    }


    with open(DATA_FILE,"w") as file:
        json.dump(users,file,indent=2)
    return jsonify({"message": "User created successfully"}), 201


@app.route("/api/<username>/add", methods=["GET", "POST"])
def add_post(username):
    data = request.get_json()
    users = load_user()

    size = datetime.now().strftime("%Y%m%d%H%M%S%f") + str(random.randint(1000, 9999))  # Safe unique ID
    newdata = {
        "image": data["posturl"],
        "content": data["postdata"],
        "date": datetime.now().strftime("%d-%m-%Y"),
        "time": datetime.now().strftime("%I:%M"),
        "Likes": 0,
        "Liked_by": [],
        "id": size,
    }

    users[username]["Posts"].append(newdata)
    with open(DATA_FILE, "w") as file:
        json.dump(users, file, indent=2)

    return jsonify("post"), 201


@app.route("/api/<username>", methods=["GET"])
def get_user_profile(username):
    users = load_user()
    user = users.get(username)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200

@app.route("/api/signin", methods=["POST"])
def get_user():
    data = request.get_json()
    users = load_user()

    username = data.get("username")
    password = data.get("password")

    if username not in users:
        return jsonify({"Message": "Wrong"}), 401

    if users[username]["Password"] != password:
        return jsonify({"Message": "Wrong"}), 401
    Profile=users[username]["Profile"]
    return jsonify({"Message": "Valid user","Prof":Profile}), 200
@app.route('/api/<username>/<passwor>')
def home(username,passwor):
    users=load_user()
    user=users[username]
    if not user:
        return jsonify({"error": "User not found"}), 404
    if user["Password"] != passwor:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)

@app.route("/api/getpost")
def get_all_posts():
    users=load_user()
    post_counter=1
    all_posts={}
    for use,user_data in users.items():
        username = user_data.get("UserName")
        profile = user_data.get("Profile")
        posts = user_data.get("Posts", [])
        for post in posts:
            post_id = f"{post_counter}"
            all_posts[post_id] = {
                "UserName": username,
                "Profile": profile,
                "content": post.get("content", ""),
                "image": post.get("image", ""),
                "date": post.get("date", ""),
                "time": post.get("time", ""),
                "id": post.get("id", 0),
                "Likes":post.get("Likes",0)

            }
            post_counter += 1
    all_post_keys=list(all_posts)
    random.shuffle(all_post_keys)
    shuffled_post={}
    for key in all_post_keys:
        shuffled_post[key]=all_posts[key]
    print(shuffled_post)
    return shuffled_post

@app.route("/api/<username>/<index>/delete")
def delete_post(username,index):
    users=load_user()

    if username not in users:
        return jsonify("Invalid User "),401
    try:
        idx = int(index)
        users[username]["Posts"].pop(idx)
        with open(DATA_FILE, "w") as file:
            json.dump(users, file,indent=2)
        return jsonify("Successfully Deleted"), 200
    except (ValueError, IndexError):
        return jsonify("Invalid Index"), 400


#Editing Profile

@app.route("/api/editpic/<username>",methods=["GET","POST"])
def edit_image(username):
    data=request.get_json()
    users=load_user()

    if username not in users:
        return jsonify("Invalid User"),401
    users[username]["Profile"]=data
    with open(DATA_FILE,"w") as file:
        json.dump(users,file,indent=4)


    return jsonify("Edited"),200
@app.route("/api/editbio/<username>",methods=["GET","POST"])
def edit_bio(username):
    data = request.get_json()
    users = load_user()

    if username not in users:
        return jsonify("Invalid User"), 401
    users[username]["Bio"]=data
    with open(DATA_FILE,"w") as file:
        json.dump(users,file,indent=4)


    return jsonify("Edited"),200

@app.route("/api/<username>/<owner>/<post_id>", methods=["POST"])
def like(username, owner, post_id):
    users = load_user()

    if username not in users or owner not in users:
        return jsonify({"error": "Invalid user(s)"}), 401

    posts = users[owner]["Posts"]
    post = next((p for p in posts if p["id"] == post_id), None)

    if post is None:
        return jsonify({"error": "Post not found"}), 404

    if username in post["Liked_by"]:
        post["Liked_by"].remove(username)
        post["Likes"] -= 1
        users[owner]["Total_Likes"]-=1
        users[username]["Total_Liked_TO"]-=1

        action = "unliked"
    else:
        post["Liked_by"].append(username)
        post["Likes"] += 1
        users[owner]["Total_Likes"] += 1
        users[username]["Total_Liked_TO"] += 1
        action = "liked"

    with open(DATA_FILE, "w") as f:
        json.dump(users, f, indent=2)

    return jsonify({
        "message": f"Post {action} successfully",
        "likes": post["Likes"],
        "liked_by": post["Liked_by"]
    }), 200

#For like
@app.route("/api/getquote")
def get_quote():
    response=requests.get("https://zenquotes.io/api/today")
    response.raise_for_status()
    data=response.json()
    print(data)
    return jsonify(data[0]),201

if __name__ == "__main__":
    app.run(debug=True)
