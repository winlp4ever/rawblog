# Artificial Neural Networks

You’ve probably already been using neural networks on a daily basis. When you ask your mobile assistant to perform a search for you—say, Google or Siri or Amazon Web—or use a self-driving car, these are all neural network-driven. Computer games also use neural networks on the back end, as part of the game system and how it adjusts to the players, and so do map applications, in processing map images and helping you find the quickest way to get to your destination.

A neural network is a system or hardware that is designed to operate like a human brain.

<div class='google-slides-container'>
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vShng-8pkFBIZs4EbYSHHyzTZhK2JuIpmL0VRMJKb1t0wm4N4JiB3l4q4JodsyVMAsSXY-8uoL9hbyh/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Neural networks can perform the following tasks:

* Translate text
* Identify faces
* Recognize speech
* Read handwritten text
* Control robots

And a lot more
Let us continue this neural network tutorial by understanding how a neural network works.

## Working of Neural Network
__A neural network__ is usually described as having different layers. The first layer is the input layer, it picks up the input signals and passes them to the next layer. The next layer does all kinds of calculations and feature extractions—it’s called the hidden layer. Often, there will be more than one hidden layer. And finally, there’s an output layer, which delivers the final result.

Let’s take the real-life example of how traffic cameras identify license plates and speeding vehicles on the road. The picture itself is 28 by 28 pixels, and the image is fed as an input to identify the license plate. Each neuron has a number, called activation, which represents the grayscale value of the corresponding pixel, ranging from 0 to 1—it’s 1 for a white pixel and 0 for a black pixel. Each neuron is lit up when its activation is close to 1.

Pixels in the form of arrays are fed into the input layer. If your image is bigger than 28 by 28 pixels, you must shrink it down, because you can’t change the size of the input layer. In our example, we’ll name the inputs as X1, X2, and X3. Each of those represents one of the pixels coming in. The input layer then passes the input to the hidden layer. The interconnections are assigned weights at random. The weights are multiplied with the input signal, and a bias is added to all of them.

...