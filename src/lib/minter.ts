import * as rp from 'request-promise'

export interface IErc {
  readonly who: string
  readonly what: string
  readonly when: string
  readonly where: string
}

export class Minter {

  public constructor(
    private endpoint: string,
    private apiKey: string,
  ) { }

  public async mint(prefix: string, erc: IErc): Promise<any> {
    const options = {
      method: 'post',
      uri: `${this.endpoint}/arks/mint/${prefix}`,
      headers: {
        'api-key': this.apiKey
      },
      body: {
        ...erc
      },
      simple: false,
      json: true,
      resolveWithFullResponse: true
    }

    return rp(options)
      .then((response) => {
        if (response.statusCode !== 200) {
          console.error(response)
          return Promise.reject(new Error(`${response.statusCode}: ${response.statusMessage}`))
        }
        return response.body.id
      })
    }

  public async get(ark: string): Promise<any> {
    const options = {
      uri: `${this.endpoint}/id/${ark}`,
      headers: {
        'api-key': this.apiKey
      },
      simple: false,
      json: true,
      resolveWithFullResponse: true
    }
    return rp(options)
    .then((response) => {
      if (response.statusCode !== 200) {
        console.error(response)
        return Promise.reject(new Error(`${response.statusCode}: ${response.statusMessage}`))
      }
      return response.body.ark as IErc
    })
  }

  public async update(ark: string, erc: IErc): Promise<any> {
    const options = {
      method: 'put',
      uri: `${this.endpoint}/id/${ark}`,
      headers: {
        'api-key': this.apiKey
      },
      body: {
        ...erc
      },
      simple: false,
      json: true,
      resolveWithFullResponse: true
    }

    return rp(options)
      .then((response) => {
        if (response.statusCode !== 200) {
          console.error(response)
          return Promise.reject(new Error(`${response.statusCode}: ${response.statusMessage}`))
        }
        return response.body.erc as IErc
      })

  }

}