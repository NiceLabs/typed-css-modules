import { getOptions } from "loader-utils";
import { loader } from "webpack";
import { makeDTSFile } from "../utils";

const loader: loader.Loader = function (source, sourceMap?) {
    if (this.cacheable) { this.cacheable(); }

    const createDTSFile = makeDTSFile(getOptions(this));

    const callback = this.async();
    if (callback === undefined) { return; }
    createDTSFile(this.resourcePath, source.toString())
        .then(() => callback(null, source, sourceMap))
        .catch((err) => callback(err));
};

export default loader;
