# NLP - A guide to recent advances

## Important concepts

Let's walk through important concepts to have a glimpse of what's going on actually in this hot trending topic.

__Language Model:__ In machine learning and deep learning, a language model is understood as a probability model over word distribution.

__N-gram and skip gram models__: Most frequently used language models in deep learning. N-gram model predicts the next word in a sentence based on what comes before, in probability, this is interpreted as: 

$$P(x0, x1, ..., xn) = P(xn|x0,...,xn-1)P(xn-1|x0...xn-2)...P(x0)$$

_Skip gram_ model is an expanded version of N-gram model, where instead of always predicting what comes __next__, it intends to unveil what comes __between__. Basically, you use x0 tills xk and from xk+2 onwards to predict xk+1.

__Masked Language Model__ - a practical skip-gram model, used in BERT:

For example, a sentence like: 'i have a dream, that is everyone can be free' will be masked randomly 15% of its words, become 'i __[masked]__ a dream, that is __[masked]__ can be free' before being passed to the network, which tries to demask all masked words. 

![img](https://docs.google.com/drawings/d/e/2PACX-1vTbBZWep6AyfO80-FwMcGp_FxoooctEmbNkT5FjaUiRuWtnq-x8ml5UtRQS6oNts2-HyvcetcXkU8DJ/pub?w=960&h=720)