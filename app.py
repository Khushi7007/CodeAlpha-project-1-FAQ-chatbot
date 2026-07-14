from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load FAQ dataset
faq = pd.read_csv("faq.csv")

questions = faq["Question"]

vectorizer = TfidfVectorizer()

question_vectors = vectorizer.fit_transform(questions)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get", methods=["POST"])
def chatbot():

    user_input = request.form["msg"]

    user_vector = vectorizer.transform([user_input])

    similarity = cosine_similarity(user_vector, question_vectors)

    index = similarity.argmax()

    score = similarity[0][index]

    if score > 0.3:
        answer = faq.iloc[index]["Answer"]
    else:
        answer = "Sorry, I don't understand your question."

    return jsonify({"reply": answer})


if __name__ == "__main__":
    app.run(debug=True)