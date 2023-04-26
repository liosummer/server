import {
  Like,
  In,
  DataSource,
  EntityManager,
  EntityTarget,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { utils, XCommonRet, getLogger } from 'xmcommon';
const log = getLogger(__filename);

export class TypeOrmUtils {
  /**
   * 简化typeorm的Like方法
   * @param paramValue
   * @returns
   */
  public static like(paramValue?: string) {
    if (utils.isNull(paramValue)) {
      return undefined;
    } else {
      return Like(`%${paramValue}%`);
    }
  }
  /**
   * 简化typeorm的in方法
   * @param paramList
   * @returns
   */
  public static in(paramList: unknown[]) {
    return In(paramList);
  }
  /**
   * 范围
   * @param paramForm 开始值
   * @param paramTo 结束值
   * @returns 返回undefined，则表示没有表达式
   */
  public static scope<T>(paramForm?: T | null, paramTo?: T | null) {
    let v = 0;
    if (utils.isNotNull(paramForm)) {
      v += 1;
    }
    if (utils.isNotNull(paramTo)) {
      v += 2;
    }
    switch (v) {
      case 1:
        return MoreThanOrEqual<T>(paramForm as T);
      case 2:
        return LessThanOrEqual<T>(paramTo as T);
      case 3:
        return Between<T>(paramForm as T, paramTo as T);
      default:
        return undefined;
    }
  }

  /**
   * 简化typeorm的Like方法
   * @param paramValue
   * @returns
   */
  public static like_begin(paramValue?: string) {
    if (utils.isNull(paramValue)) {
      return undefined;
    } else {
      return Like(`${paramValue}%`);
    }
  }
  /**
   * 简化typeorm的Like方法
   * @param paramValue
   * @returns
   */
  public static like_end(paramValue?: string) {
    if (utils.isNull(paramValue)) {
      return undefined;
    } else {
      return Like(`%${paramValue}`);
    }
  }
  /**
   * 删除对象中，属性值为null或undefined的属性
   * @param paramWhere 要处理的对象
   * @returns 处理的对象
   */
  public static cleanNull(paramWhere: any) {
    const delKey: string[] = [];
    for (const k in paramWhere) {
      if (utils.isNull(paramWhere[k])) {
        delKey.push(k);
      }
    }

    for (const k of delKey) {
      delete paramWhere[k];
    }
    return paramWhere;
  }

  /**
   * 处理bigint的参数
   * @param paramValue 要处理的值
   */
  public static bigInt(paramValue?: number): string | undefined {
    if (utils.isNull(paramValue)) {
      return undefined;
    } else {
      return String(paramValue);
    }
  }

  /**
   * 生成查询Builder
   * @param paramMgr EntityManager
   * @param paramEntity EntityTarget<T>
   * @param paramAliasName 别名
   * @returns
   */
  public static builder<T>(
    paramMgr: EntityManager,
    paramEntity: EntityTarget<T>,
    paramAliasName = 'a',
  ) {
    return paramMgr.createQueryBuilder<T>(paramEntity, paramAliasName);
  }

  /**
   * 事物
   * @param paramDS TypeORM的数据源
   * @param paramRunInTransaction 执行事物的函数
   * @param paramTransName 事物名称，没有传入空串或null
   */
  public static async transaction<T = unknown>(
    paramDS: DataSource,
    paramRunInTransaction: (paramMgr: EntityManager) => Promise<XCommonRet<T>>,
  ): Promise<XCommonRet<T>>;
  public static async transaction<T = unknown>(
    paramDS: DataSource,
    paramRunInTransaction: (paramMgr: EntityManager) => Promise<XCommonRet<T>>,
    paramTransName: string,
  ): Promise<XCommonRet<T>>;
  public static async transaction<T = unknown>(
    paramDS: DataSource,
    paramRunInTransaction: (paramMgr: EntityManager) => Promise<XCommonRet<T>>,
    paramTransName?: string,
  ): Promise<XCommonRet<T>> {
    let transTag = '';
    if (!utils.isEmpty(paramTransName)) {
      transTag = `[${paramTransName}]`;
    }

    const r = new XCommonRet<T>();

    const queryRunner = paramDS.createQueryRunner();
    log.info(`开始事物:${transTag}`);
    await queryRunner.startTransaction();
    try {
      // 执千事物中的逻辑
      const result = await paramRunInTransaction(queryRunner.manager);
      if (result.isNotOK) {
        log.warn(`事物${transTag}执行失败:${JSON.stringify(result)}`);
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }
      r.assignFrom(result);
    } catch (e) {
      r.setError(-1, `事物异常:${String(e)}`);
      log.warn(`事物${transTag}异常:${JSON.stringify(r)}`);
      await queryRunner.rollbackTransaction();
    }
    await queryRunner.release();
    return r;
  }
}
