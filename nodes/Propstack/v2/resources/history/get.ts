import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { V2 } from "../../constants";
import { paginate } from "../../helpers";

const HISTORY_URLS: Record<string, (id: string) => string> = {
  messages: V2.HISTORY_MESSAGES,
  notes: V2.HISTORY_NOTES,
  events: V2.HISTORY_EVENTS,
  tasks: V2.HISTORY_TASKS,
  deals: V2.HISTORY_DEALS,
};

export async function historyGet(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const historyType = this.getNodeParameter("historyType", 0) as string;
  const entityId = this.getNodeParameter("entityId", 0) as string;
  const returnAll = this.getNodeParameter("returnAll", 0) as boolean;
  const limit = this.getNodeParameter("limit", 0, 50) as number;

  const urlFn = HISTORY_URLS[historyType];
  const url = urlFn(entityId);

  return paginate.call(this, {
    url,
    qs: {} as IDataObject,
    returnAll,
    limit,
  });
}
