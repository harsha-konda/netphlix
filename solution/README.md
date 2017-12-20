
## Code
### Similarity.py
Computes the similairty between to users using cosine similairty

### Recommend.py
1. accepts a post request of form `{movies:[:ids]}`
2. curls the node api to get the results
3. computes similairty between each hit and input
4. takes the top 10 and evaluates score of each movie to recommend the top movie

### Recommend_v2.py

1. score is calculated in a different way, akin to tfidf a more frequently occuring movie is penalized over the less frequently occuring movie for extra personaliztion
2. `foregroundPercentage = TF(w = W,U ∈ {user with topSimscore})/∑ users`
3. `backgroundPercentage = TF(w =W,U  ∈ {for all documents})/∑ users`
4. `score= foregroundPercentage/backgroundPercentage *(foregroundPercentage-backgroundPercentage)`

## extensions
1.  *Matrix Factorization*: precompute ø for each user and multiply it to get the result and predict the likely rating that user might give.
2. *Naive Bayes*: predict the occurunce of P(B|A) given P(A|B) for each of the movies.
