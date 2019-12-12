# Final Project for CSCI 4131
## Project Type:
```
C
```
## Memeber Names:
```
Clark Ohnesorge
```
## Project Link:
```
[Final Project](https://microblog-4131.herokuapp.com) deployed on Heroku
```
## Github Link:
```
[Repository](https://github.com/GusOhnesorge/microblog-4131)
```
## List of Technologies Used
1. Wtforms
2. Flask
3. Sql (provided through flask)
## List of Controllers
### index
At the end of index the template for your home screen is rendered. However if
the user is not logged in they are redirected to the log in screen.
### follow
Handles the following logic. Checks if you are trying to follow a non existent user
or yourself. If not, calls the follow function in User class to add the user you want
to follow to a table of users being followed by the current user.
### unfollow
Similar to follow, just removes the chosen user from current user's followed list.
### login
Checks entered username and password against stored username and hashed password.
If they match user is redirected to their index page. Otherwise error messages show
and users can try again.
### logout
Uses logout_user() provided by flask logout to log the user out of the current session.
### register
Allows the user to add a username and hashed password to the database of users.
There are checks done that make sure the username and email are not already taken
by another user.
### edit_profile
Redirects user to the edit profile page. Here the user can submit a new username and
about section.
### user
Loads the profile page for the selected user. Displays the blog posts made by this user.

## List of Views
### base.html
This is the foundational page that most other pages extend. This contains the nav bar
at the top of the screen. That nav bar has links to your your index page, the explore page, your profile
page, and a logout button to log out with.
### index.html
This is the home page of the application. It states the user that is logged in.
Here the user can enter text in a text box. When they click submit the text that is
in the text box is turned into a post that other users can see.
### login.html
The user enters their username and password. That password is then checked
against a saved and hashed password. If it matches then the user is logged into the profile
matching the username. The user can also navigate to the register page at the bottom of this page.
### register.html
This page is linked to by the login page. The user chooses a username,
email, and password. The username cannot be taken already. These are then added to a database.
### user.html
This page displays a user's user name, profile image, number of followers
and people they follow, and the last time they were online. Links to the edit_profile
page if it is your user page.
### edit_profile.html
This page lets the user edit their user name and their about
section on their profile. Linked to by user page.
### \_post.html
This is a sub page. It appears on other pages and is made up of the
blog posts that users have poster. Shows up on user pages and index pages.
### 404.html
Page for 404 errors that users may come across.
### 500.html
Page for 500 errors that users may come across.
## List of Tables
### Users
A User holds an id, username, email, their hashed password, their posts, their about
page, and the people the follow. A user has many posts.
### Posts
A Post holds an id, the text of the post, the timestamp when the post was made,
and the id of the user that made the post. A post has one user.
### Followers
Is a table that holds two user ids. One is the id of the user following, and the other
is the id of the user being followed. This is a many to many, self referential relationship.

## References/Resources
This [tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
was the guide I followed for this project.
