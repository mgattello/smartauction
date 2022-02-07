/**
 * @jest-environment jsdom
 */
import 'regenerator-runtime';
import { loadWeb3 } from '../app';

test('load web3 provider', async () => {
    // const data = await loadWeb3();
    // expect(data).toBeTruthy();
})

// test('the fetch fails with an error', async () => {
//     expect.assertions(1);
//     try {
//       await fetchData();
//     } catch (e) {
//       expect(e).toMatch('error');
//     }
// });