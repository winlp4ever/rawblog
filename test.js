
const wait = async (secs) => {
    await new Promise(res => setTimeout(() => res(), secs * 1000));
    console.log('done waiting');
};

//wait(5);

u = {}
u['c'] = 1
u['b'] = 0
u['d'] = 2
console.log(u)
u['c'] = 5
console.log(u)