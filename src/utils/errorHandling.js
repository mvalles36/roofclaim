function jw(e, t, n) {
    return {
        value: e,
        source: null,
        stack: n ?? null,
        digest: t ?? null
    }
}

function D1(e, t) {
    try {
        // Check if 't' and 't.value' are defined before accessing
        if (t && t.value !== undefined) {
            console.error(t.value);
        } else {
            console.error("Error occurred, but details are unavailable");
        }
    } catch (n) {
        setTimeout(function() {
            throw n;
        });
    }
}

var j9 = typeof WeakMap == "function" ? WeakMap : Map;

function rD(e, t, n) {
    // Check if 'e' is defined before accessing its properties
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in rD function");
        return;
    }

    n = Do(-1, n);
    n.tag = 3;
    n.payload = {
        element: null
    };
    
    // Only access e.name if e is defined
    if (e.name) {
        n.payload.element = e.name;
    }

    return n;
}

// Export the functions if needed
export { jw, D1, j9, rD };