export default (() => {
    let counter = 0;

    return () => ++counter;
})();
