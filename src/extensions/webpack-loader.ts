import { getOptions } from "loader-utils";
import { callbackify } from "util";
import { loader } from "webpack";
import { makeCreateDTSFile } from "../utils";

export default function loader(this: loader.LoaderContext, source: string) {
    this.cacheable();

    const createDTSFile = makeCreateDTSFile(getOptions(this));

    const handler = async () => {
        await createDTSFile(this.resourcePath, source);
    };

    callbackify(handler)(this.async());
}
