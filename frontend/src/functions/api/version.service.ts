import axios from "axios";

const versionApi = {
    getVersionMessage: (): Promise<{header: string, msg: string}> => {
        return new Promise<{header: string, msg: string}>((resolve, reject) => {
            const seenVersionLog = localStorage.getItem("seenVersion");
            axios.get("https://api.github.com/repos/UnkoR00T/slu/commits").then(res => {
                const lastCommit = res.data[0].commit;
                const version = extractTag(lastCommit.message);
                if(!seenVersionLog && version){
                    localStorage.setItem("seenVersion", version);
                    return resolve({
                        header: version,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        msg: extractMessage(lastCommit.message)
                    })
                }
                if(seenVersionLog && version && version != seenVersionLog){
                    localStorage.setItem("seenVersion", version);
                    return resolve({
                        header: version,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        msg: extractMessage(lastCommit.message)
                    })
                }
            })
        })
    },

}

const extractTag = (commitMessage: string) => {
    const match = commitMessage.match(/v[\d.]+#\d+/);
    return match ? match[0] : null;
}
function extractMessage(commitMessage: string) {
    const parts = commitMessage.split('\n');
    return parts.length > 1 ? parts.slice(1).join('\n').trim() : null;
}


export {versionApi, extractTag}