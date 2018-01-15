import { getOptions } from "loader-utils";
import { loader } from "webpack";
import { makeCreateDTSFile } from "../utils";

export default function loader(this: loader.LoaderContext, source: string, sourceMap: string) {
    this.cacheable();

    const callback = this.async();
    const createDTSFile = makeCreateDTSFile(getOptions(this));

    createDTSFile(this.resourcePath, source)
        .then(() => callback(undefined, source, sourceMap))
        .catch((err) => callback(err));
}
