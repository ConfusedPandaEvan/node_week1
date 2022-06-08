//checking connection
GET "/"

//get posts based on order
GET "/textpost"

//create posts
POST "/textpost"

//delete post
DELETE "textpost/:postId"

//change post
PATCH "textpost/:postId"

//get specific post with comments
GET "textpost/:postId"

//create comment
POST "textpost/:postId"

//delete comment
POST "textpost/:postId/:commentId"

//change comment
PATCH  "textpost/:postId/:commentId"