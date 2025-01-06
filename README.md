This is a fork of the repository to solve a problem we were having.

1954:    // when we use the local/session storage we perform the serialize, otherwise we let the passed storage implementation to do it
    const isLocalStorage = (hasLocalStorage() && storage === localStorage) || (hasSessionStorage() && storage === sessionStorage);
    observify(storage.getItem(key)).subscribe((value) => {
        let storageState = isObject(value) ? value : deserialize(value || '{}');
        function save(storeCache) {
            storageState['$cache'] = Object.assign({}, (storageState['$cache'] || {}), storeCache);
            storageState = Object.assign({}, storageState, acc);
            //@chriszrc TODO!!! I changed this so both strategies run serialize
            buffer.push(storage.setItem(key, isLocalStorage ? serialize(storageState) : serialize(storageState)));
            _save(buffer.shift());
        }
``` 



----
# THE LIBRARY IS NOT MAINTAINED ANYMORE - DON'T USE IT

## Elf, a newer state management solution, has been published. We recommend [checking it out](https://ngneat.github.io/elf/) 🚀

![Akita](https://s8.postimg.cc/d4m3fc9tx/image.png)

> A Reactive State Management Tailored-Made for JS Applications





Whether it be Angular, React, Vue, Web Components or plain old vanilla JS, Akita can do the heavy lifting and serve as a useful tool for maintaining clean, boilerplate-free, and scalable applications.

<hr />

[![Downloads](https://img.shields.io/npm/dt/@datorama/akita.svg?style=flat-square)]()
[![Build Status](https://github.com/datorama/akita/workflows/Build/badge.svg)](https://github.com/datorama/akita/actions?query=workflow%3A%22Build%22)
[![Tests](https://github.com/datorama/akita/workflows/Tests/badge.svg)](https://github.com/datorama/akita/actions?query=workflow%3A%22Tests%22)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Akita is a state management pattern, built on top of RxJS, which takes the idea of multiple data stores from Flux and the immutable updates from Redux, along with the concept of streaming data, to create the Observable Data Stores model.

Akita encourages simplicity. It saves you the hassle of creating boilerplate code and gives powerful tools with a moderate learning curve, suitable for both experienced and inexperienced developers alike.

👉 [10 Reasons Why You Should Start Using Akita as Your State Management Solution](https://engineering.datorama.com/10-reasons-why-you-should-start-using-akita-as-your-state-management-solution-66b63d033fec)

- 🤓 Learn about it on the [docs site](https://opensource.salesforce.com/akita/)
- 🚀 See it in action on [StackBlitz](https://stackblitz.com/edit/akita-todos-app)
- 😎 Use the [CLI](https://github.com/datorama/akita/tree/master/tools/akita-cli)
- 👉 Checkout the [sample application](http://akita.surge.sh/)
