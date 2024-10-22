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
    } else {
        console.warn("Warning: 'e.name' is undefined in rD function");
    }

    return n;
}

function KSe(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in KSe function");
        return;
    }

    if (e.name !== undefined) {
        console.log("KSe function processing:", e.name);
    } else {
        console.warn("Warning: 'e.name' is undefined in KSe function");
    }
    // Implement KSe function logic here
}

function dO(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in dO function");
        return;
    }
    console.log("dO function processing:", e);
    // Implement dO function logic here
}

function OD(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in OD function");
        return;
    }
    console.log("OD function processing:", e);
    // Implement OD function logic here
}

function _D(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in _D function");
        return;
    }
    console.log("_D function processing:", e);
    // Implement _D function logic here
}

function z9(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in z9 function");
        return;
    }
    console.log("z9 function processing:", e);
    // Implement z9 function logic here
}

function ng(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in ng function");
        return;
    }
    console.log("ng function processing:", e);
    // Implement ng function logic here
}

function X1(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in X1 function");
        return;
    }
    console.log("X1 function processing:", e);
    // Implement X1 function logic here
}

function bD(e) {
    if (e === undefined || e === null) {
        console.error("Error: 'e' is undefined or null in bD function");
        return;
    }
    console.log("bD function processing:", e);
    // Implement bD function logic here
}

export { jw, D1, j9, rD, KSe, dO, OD, _D, z9, ng, X1, bD };