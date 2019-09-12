import useIntersectionObserver from "./useIntersectionObserver";


const trackedLoaders = [];
let trackedTm = 0;

const trackedTick = () => {
    let el = trackedLoaders.shift();
    if (el) {
        // display the image
        el.callback();
        Promise.resolve().then(() => {
            // find already displayed image and track the loading state
            const target = el.ref.current;
            const img = target.querySelector('picture img, img') || target;
            const done = () => {
                if (!el) {
                    return;
                }
                trackedTm = 0;
                // eslint-disable-next-line no-use-before-define
                chargeTrackedLoader();
                img.removeEventListener('load', done);
                img.removeEventListener('error', done);
                el = null;
            };
            if (img) {
                if (img.naturalWidth) {
                    // it was cached, ready to load a new one
                    done();
                } else {
                    // go to the next image if...
                    img.addEventListener('load', done);
                    img.addEventListener('error', done);
                    setTimeout(done, 500);
                }
            } else {
                done();
            }
        });
    } else {
        trackedTm = 0;
    }
};

function chargeTrackedLoader() {
    if (!trackedTm) {
        trackedTm = setTimeout(trackedTick, 16);
    }
}

const addTrackedLoader = (callback, ref) => {
    trackedLoaders.push({callback, ref});
    if (trackedLoaders.length === 1) {
        chargeTrackedLoader();
    }
};

export {useIntersectionObserver, addTrackedLoader}
