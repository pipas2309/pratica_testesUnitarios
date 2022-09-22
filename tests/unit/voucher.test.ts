import { number } from 'joi';
import voucherRepository from '../../src/repositories/voucherRepository';
import voucherService from '../../src/services/voucherService';
import * as voucerFactory from '../factories/createVoucer';

describe('Teste unitário do voucher', () => {
  it('Testa se cria com sucesso', async () => {
    const voucher = await voucerFactory.__createVoucer();

    jest //RETORNA UM VOUCHER CRIADO (PELO FAKER)
      .spyOn(voucherRepository, 'createVoucher')
      .mockImplementationOnce(():any => {voucher});
    jest //VOLTA NULO POIS NÃO EXISTE VOUCHER CRIADO
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockImplementationOnce(():any => {});

      await expect(voucherService.createVoucher(voucher.code, voucher.discount)).resolves.not.toThrow();
      expect(voucherRepository.getVoucherByCode).toBeCalled();
  });

  it('Testa se cria duplicado', async () => {
    const voucher = await voucerFactory.__createVoucer();

    jest
      .spyOn(voucherRepository, 'createVoucher')
      .mockResolvedValueOnce(voucher);
    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher);

    const result = voucherService.createVoucher(voucher.code, voucher.discount)
    expect(result).rejects.toEqual({type: "conflict", message:"Voucher already exist."})
  });

  it('Aplicando Voucher', async () => {
    const voucher = await voucerFactory.__createVoucer();
    const amount = 100;

    jest  //Usa o voucher
      .spyOn(voucherRepository, 'useVoucher')
      .mockResolvedValueOnce({...voucher, used: false});
    jest  //Encontra com sucesso o Voucher
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher);

    const finalAmount = amount - amount * (voucher.discount / 100)
    if(voucher.discount > 0) {
      expect(finalAmount).toBeLessThan(amount);
    }
    await expect(voucherService.applyVoucher(voucher.code, amount)).resolves.not.toThrow();
  });

  it('Aplicando Voucher usado', async () => {
    const voucher = await voucerFactory.__createVoucer();
    const amount = 100;

    jest  //Encontra com sucesso o Voucher
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(null);

    const result = voucherService.applyVoucher(voucher.code, amount);

    await expect(result).rejects.toEqual({type: "conflict", message: "Voucher does not exist."})
  });

});