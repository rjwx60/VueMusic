import { Subject } from "rxjs";

export const subscriptions = {
  msg: new Subject(),
  MSG: new Subject()
}

// Example
// ...mapMutations({
//   setDisc: 'SET_DISC'
// })
// ...mapGetters([
//   'sequenceList',
//   'playlist',
//   'currentSong',
//   'mode',
//   'favoriteList'
// ]),

// 目标: 输出到到实例 this 上
// 即 this[key] = subscriptions[key]
export function mapObservers(vm, args){
  if (Object.prototype.toString.call(args).slice(8, 13).toLocaleLowerCase() === 'array') {
    args.forEach(cv => {
      vm[cv] = subscriptions[cv];
    })
  }
}
