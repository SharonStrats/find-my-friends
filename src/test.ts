import { fetchWebIds } from 'solid-friend-picker';

export function test() {
  (async () => {
    let generator = fetchWebIds();
    for await (let webId of generator) {
      console.log(webId);
    }
  })();
}
