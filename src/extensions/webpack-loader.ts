import { getOptions } from "loader-utils";
import { callbackify } from "util";
import { loader } from "webpack";
import { makeCreateDTSFile } from "../utils";

const loader: loader.Loader = function(source, sourceMap?) {
    if (this.cacheable) {
        this.cacheable();
    }

    const createDTSFile = makeCreateDTSFile(getOptions(this));

    const callback = this.async();
    createDTSFile(this.resourcePath, source.toString())
        .then(() => callback(null, source, sourceMap))
        .catch((err) => callback(err));
};

export default loader;
