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
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in rD function");
        return;
    }

    n = Do(-1, n);
    n.tag = 3;
    n.payload = {
        element: null
    };
    
    if (e.name) {
        n.payload.element = e.name;
    }

    return n;
}

function KSe(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in KSe function");
        return;
    }

    if (e.name !== undefined) {
        console.log(e.name);
    } else {
        console.error("Error: 'e.name' is undefined in KSe function");
    }

    // Placeholder for the rest of the KSe function
    // Add the original code here
}

function dO(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in dO function");
        return;
    }

    // Placeholder for the rest of the dO function
    // Add the original code here
}

function OD(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in OD function");
        return;
    }

    // Placeholder for the rest of the OD function
    // Add the original code here
}

function _D(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in _D function");
        return;
    }

    // Placeholder for the rest of the _D function
    // Add the original code here
}

function z9(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in z9 function");
        return;
    }

    // Placeholder for the rest of the z9 function
    // Add the original code here
}

function ng(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in ng function");
        return;
    }

    // Placeholder for the rest of the ng function
    // Add the original code here
}

function X1(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in X1 function");
        return;
    }

    // Placeholder for the rest of the X1 function
    // Add the original code here
}

function bD(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in bD function");
        return;
    }

    // Placeholder for the rest of the bD function
    // Add the original code here
}

export { jw, D1, j9, rD, KSe, dO, OD, _D, z9, ng, X1, bD };
