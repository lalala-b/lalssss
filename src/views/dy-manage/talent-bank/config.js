export const fieldConfigData = [{
  level: 1,
  name: '',
  field: 'base',
  children: [{
    level: 2,
    name: '自定义CPM',
    field: 'customCpm',
    unit: '',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '粉丝数',
    field: 'fansNum',
    cancel: true,
    defaultShow: 1,
    exportDefaultShow: 1,
    icon: '',
    iconUrl: ''
  }, {
    level: 2,
    name: '近7日涨粉量',
    field: 'nealy7dAddFans',
    cancel: true,
    defaultShow: 1,
    exportDefaultShow: 1
  }, {
    level: 2,
    name: '历史合作次数',
    field: 'accountUserCount',
    cancel: true,
    defaultShow: 1,
    exportDefaultShow: 1,
    icon: 'iconshipin',
    iconUrl: '/putting-manager/drop-video-library'
  }, {
    level: 2,
    name: '所属MCN机构',
    field: 'mcnName',
    cancel: true,
    defaultShow: 1,
    exportDefaultShow: 0
  }]
}, {
  level: 1,
  name: '',
  field: 'nums',
  children: [{
    level: 2,
    name: '近7天播放量中位数',
    field: 'nealy7dMedianPlay',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '近7条播放量中位数',
    field: 'nealy7PerMedianPlay',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '近7天集均播放量',
    field: 'nealy7dAvgPlay',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '近7条集均播放量',
    field: 'nealy7PerAvgPlay',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '近10条视频删除条数',
    field: 'nealy10PerDeleteCount',
    cancel: true,
    unit: '条',
    defaultShow: 0,
    exportDefaultShow: 0
  },
  {
    level: 2,
    name: '近30天个人视频平均时长',
    field: 'nealy30dSelfVideoTimeAverage',
    unit: 's',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  },
  {
    level: 2,
    name: '近30天星图视频平均时长',
    field: 'nealy30dXingtuVideoTimeAverage',
    unit: 's',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '星图指数',
    field: 'xingtuIndexNumber',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }]
}, {
  level: 1,
  name: '',
  field: 'other',
  children: [{
    level: 2,
    name: '性别分布',
    field: 'sexProportions',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '年龄分布TOP2',
    field: 'ageProportions',
    type: 'distributionTop',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '城市等级分布TOP2',
    field: 'cityProportions',
    type: 'distributionTop',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '八大人群分布TOP2',
    field: 'personProportions',
    type: 'distributionTop',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  }, {
    level: 2,
    name: '设备分布TOP2',
    field: 'phoneProportions',
    type: 'distributionTop',
    cancel: true,
    defaultShow: 0,
    exportDefaultShow: 0
  },
  // {
  //   level: 2,
  //   name: '可上门回收城市占比',
  //   field: 'recyclableCityProportion',
  //   cancel: true,
  //   defaultShow: 0,
  //   exportDefaultShow: 0
  // },
  {
    level: 2,
    name: '八大人群正负中性画像分布',
    field: 'mulDrawProportions',
    defaultShow: 0,
    cancel: true,
    // 单选组的配置
    type: 'radioGroup',
    radioChildren: [{
      title: 'Z世代',
      field: 'generationZProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '都市蓝领',
      field: 'urbanBlueCollarProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '小镇青年',
      field: 'smallTownYouthProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '小镇中老年',
      field: 'smallTownElderlyProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '新锐白领',
      field: 'newWhiteCollarWorkersProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '资深中产',
      field: 'seniorMiddleClassProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '精致妈妈',
      field: 'exquisiteMotherProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }, {
      title: '都市银发',
      field: 'urbanSilverHairProportion',
      options: ['正向', '负向', '中性'],
      defaultIndex: 0,
      defaultSelect: '正向'
    }]
  }]
}]

export const fieldSortConfigData = fieldConfigData.map(item => {
  return item.children.map(it => {
    // delete it.children

    if (it.defaultShow) {
      return it
    } else {
      return ''
    }
  }).filter(it => it)
}).flat(Infinity)
