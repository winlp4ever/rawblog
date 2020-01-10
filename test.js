
const wait = async (secs) => {
    await new Promise(res => setTimeout(() => res(), secs * 1000));
    console.log('done waiting');
};

wait(5);