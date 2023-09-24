/**
 * 地理位置解析执行队列
 */

let cacheLocData: { address?: any; addressComponent?: any; roadName?: any } = {};
let cacheLonlat = '';

class TaskQueue {
  max = 1;
  taskList: any[] = [];
  constructor() {
    this.max = 2; //最大并发数
    this.taskList = []; //用shift方法实现先进先出
    setTimeout(() => {
      //这里初始化队列后自动执行，后续有新任务添加则需要手动执行。
      this.run();
    });
  }

  addTask(task: { glon: any; glat: any; loctype: string; mtype: string; callback: any }) {
    this.taskList.push(task);
  }

  run() {
    const length = this.taskList.length;
    if (!length) {
      return;
    }
    const min = Math.min(length, this.max); // 控制并发数量
    for (let i = 0; i < min; i++) {
      const task = this.taskList.shift();
      let { glon, glat, loctype, mtype, callback } = task;
      try {
        this.max--; //开始占用一个任务的空间
        if (glon == '0' || glat == '0') {
          callback('无数据');
          this.max++; //任务完成，释放空间
          this.run(); //自动进行下一个任务
          return;
        }

        if (`${glon},${glat}` == cacheLonlat) {
          callback(
            cacheLocData.address,
            cacheLocData.addressComponent ? cacheLocData.addressComponent : [],
            cacheLocData.roadName ? cacheLocData.roadName : '',
          );
          this.max++; //任务完成，释放空间
          this.run(); //自动进行下一个任务
          return;
        }

        // ServerLocationQueryPromise(glon, glat, loctype, mtype)
        //   .then((data: { address: any; addressComponent: any; roadName: any }) => {
        //     //回调
        //     callback(
        //       data.address,
        //       data.addressComponent ? data.addressComponent : [],
        //       data.roadName ? data.roadName : '',
        //     );
        //     //添加缓存
        //     cacheLonlat = `${glon},${glat}`;
        //     cacheLocData = data;
        //   })
        //   .catch((err: any) => {
        //     callback('无数据');
        //     //清除缓存
        //     cacheLonlat = '';
        //     cacheLocData = null;
        //   })
        //   .finally(() => {
        //     this.max++; //任务完成，释放空间
        //     this.run(); //自动进行下一个任务
        //   });
      } catch (e) {
        console.log(e);
      }
    }
  }
}

let taskQueue = new TaskQueue();
