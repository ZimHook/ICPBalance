export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const AccountBalanceArgs = IDL.Record({ 'account' : AccountIdentifier });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Memo = IDL.Nat64;
  const SubAccount = IDL.Vec(IDL.Nat8);
  const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const TransferArgs = IDL.Record({
    'to' : AccountIdentifier,
    'fee' : Tokens,
    'memo' : Memo,
    'from_subaccount' : IDL.Opt(SubAccount),
    'created_at_time' : IDL.Opt(TimeStamp),
    'amount' : Tokens,
  });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  const TransferFeeArg = IDL.Record({});
  const TransferFee = IDL.Record({ 'transfer_fee' : Tokens });
  return IDL.Service({
    'account_balance' : IDL.Func([AccountBalanceArgs], [Tokens], ['query']),
    'decimals' : IDL.Func(
        [],
        [IDL.Record({ 'decimals' : IDL.Nat32 })],
        ['query'],
      ),
    'name' : IDL.Func([], [IDL.Record({ 'name' : IDL.Text })], ['query']),
    'symbol' : IDL.Func([], [IDL.Record({ 'symbol' : IDL.Text })], ['query']),
    'transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'transfer_fee' : IDL.Func([TransferFeeArg], [TransferFee], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };