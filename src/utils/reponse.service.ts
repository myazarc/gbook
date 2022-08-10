export class ResponseService {
  res = {
    status: false,
    error: null,
    data: null,
  };
  constructor(status: boolean = false, data: any = null, error: any = null) {
    this.res.status = status;
    this.res.data = data;
    this.res.error = error;
  }

  setStatus(status: boolean) {
    this.res.status = status;
  }
  setData(data: any) {
    this.res.status = true;
    this.res.data = data;
  }

  setError(error: any) {
    this.res.status = false;
    this.res.error = error;
  }

  getResponse() {
    return this.res;
  }
}
