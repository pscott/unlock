import React from 'react'
import * as rtl from 'react-testing-library'
import * as apolloHooks from '@apollo/react-hooks'
import sigUtil from 'eth-sig-util'
import VerificationStatus, {
  Identity,
  OwnsKey,
} from '../../../components/interface/VerificationStatus'
import * as durations from '../../../utils/durations'

describe('VerificationStatus', () => {
  describe('Main component', () => {
    it('should show an error if any required data is missing', () => {
      expect.assertions(0)

      const { getByText } = rtl.render(<VerificationStatus />)

      getByText('No Signature Data Found')
    })

    it('should render full results if all data is present', () => {
      expect.assertions(0)

      const apolloSpy = jest.spyOn(apolloHooks, 'useQuery')
      apolloSpy.mockReturnValue({
        loading: true,
        error: undefined,
        data: undefined,
      } as any)

      const sigUtilSpy = jest.spyOn(sigUtil, 'recoverPersonalSignature')
      sigUtilSpy.mockReturnValue('0xdeadbeef')

      const { getByText } = rtl.render(
        <VerificationStatus
          data={{
            accountAddress: '0xdeadbeef',
            lockAddress: '0x123abc',
            timestamp: 1234567,
          }}
          sig="this is a signature string, essentially"
          hexData="this is some hex data"
        />
      )

      getByText('Identity is valid.')
    })
  })

  describe('Identity', () => {
    it('should indicate when an identity assertion is invalid', () => {
      expect.assertions(0)

      const { getByText } = rtl.render(<Identity valid={false} />)

      getByText('Identity is INVALID.')
    })

    it('should indicate when an identity assertion is valid', () => {
      expect.assertions(0)

      const { getByText } = rtl.render(<Identity valid />)

      getByText('Identity is valid.')
    })
  })

  describe('OwnsKey', () => {
    it('should indicate when it is loading', () => {
      expect.assertions(0)

      const { getByText } = rtl.render(
        <OwnsKey loading error={undefined} data={{}} lockAddress="0x123abc" />
      )

      getByText('Checking if user has a valid key...')
    })

    it('should indicate when there is an error', () => {
      expect.assertions(0)

      const { getByText } = rtl.render(
        <OwnsKey
          loading={false}
          error={new Error('oh bother') as any}
          data={{}}
          lockAddress="0x123abc"
        />
      )

      getByText('Error: oh bother')
    })

    it('should indicate when the user does not have a key', () => {
      expect.assertions(0)

      const { getByText } = rtl.render(
        <OwnsKey
          loading={false}
          error={undefined}
          data={{
            keyHolders: [
              {
                keys: [],
              },
            ],
          }}
          lockAddress="0x123abc"
        />
      )

      getByText('This user does not have a key to the lock.')
    })

    it('should indicate when the key is expired', () => {
      expect.assertions(0)

      const spy = jest.spyOn(durations, 'expirationAsDate')
      spy.mockReturnValue('Expired')

      const { getByText } = rtl.render(
        <OwnsKey
          loading={false}
          error={undefined}
          data={{
            keyHolders: [
              {
                keys: [
                  {
                    lock: {
                      address: '0x123abc',
                    },
                    expiration: '12345678',
                  },
                ],
              },
            ],
          }}
          lockAddress="0x123abc"
        />
      )

      getByText('The key has EXPIRED')
    })

    it('should indicate when the key is valid', () => {
      expect.assertions(0)

      const spy = jest.spyOn(durations, 'expirationAsDate')
      spy.mockReturnValue('November 14, 3021')

      const { getByText } = rtl.render(
        <OwnsKey
          loading={false}
          error={undefined}
          data={{
            keyHolders: [
              {
                keys: [
                  {
                    lock: {
                      address: '0x123abc',
                    },
                    expiration: '12345678',
                  },
                ],
              },
            ],
          }}
          lockAddress="0x123abc"
        />
      )

      getByText(
        'This user DOES own a key, which is valid until November 14, 3021'
      )
    })
  })
})