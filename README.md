# Machine-learning-game

*First of all, I'm not a machine learning student and I've got no experience in this domain, this is just a test experience and I'm shit at theory so if you're a machine learning worker I sincerely excuse for the eye bleeding*

## How the game works

**This project is a basic game played by a simple neuronal-based learning algorithm**

The goal of the game is for the player ( blue ) to reach the treasure ( yellow ) while dodging the enemies ( red ). I initially wanted to put walls so that would make more obstacles on top of enemies but they play the same role as enemies as you need to dodge them.

&nbsp;

*The program itself is using 2 layers of 4 neurons to make its decisions ( I'm still not sure if we can call that layers tho so let's just call them neurons groups ).*

&nbsp;

The first neuron groups ( we'll call them the case neurons ) is in charge of **the cases close to the player** ( there is one neuron for each case close to the player: top, right, bottom and left )

The second neuron groups ( we'll call them the moves neurons ) is in charge of **the direction the treasure is compared to the player** ( top, right, bottom and left too )

Each of the 8 neurons, given an input value, outputs a value ( between 0 and 1 for the case neurons and between 0 and 2 for the moves neurons ) corresponding to **the worth of the action**

&nbsp;

For example if we ask the neuron in charge of the case top from the player and there is an enemy in it he'll answer 0 because the action has no value ( we die if we go in the case ), if there is the treasure in it he'll output 1 ( we win if we go to that case, the best case possible ), if there's nothing we neither die nor win so he'll output 0.5

The second neurons groups will output a value > 1 if we get closer to the treasure ( if we go right while the treasure if on our right ) and a value < 1 if we get further from the treasure

&nbsp;

The algorithm navigates through the map while **taking the best actions possible** ( dodging enemies while getting closer to the treasure ) until it reaches it and win

## Machine Learning

**So, how is this machine learning and how does it work ?**

&nbsp;

Each of the neurons action-values are registered in a JSON array corresponding to each neuron like this:

`{id: *The neuron's id*, empty: *Value if the case is empty*, enemy: *Value if there is an enemy*, treasure: *Value if there is the treasure*}'

At the beginning of the program and as you can see in the file **data.js**, all values are initialized to -1 ( which means the value is unknown). Before taking decisions and doing the best action possible, the algorithm looks if one of the action equals -1, and if there is one it does it and looks for what happens: that's called the **reward**

To simplify it: if there is an enemy is the case and the value is -1, the program doesn't know what happens so it just goes in and dies. Then it saves the value as 0 because if's the worst action to do. **That way, the program learned itself what happened when you go right into an enemy**, and it just pretty luch learns everything like that

That's why, when you launch it, if just suicides into the enemy 4 times and then dodges it everytime after

**If you have knowlegde on the subject and have a comment to make about this project don't hesitate, I was just doing this to try a little bit but I would love to learn more about it and learn the good practices of the field :)**
