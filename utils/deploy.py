#! /usr/bin/env python3
# Author: Kapil Thadani (kapil.thadani@gmail.com)

import argparse
import os
import subprocess
import tempfile


def replace_name(contract_name, line):
    """Replace name in contract line.
    """
    i = line.find(contract_name)
    return line[:i] + "Example" + line[i+len(contract_name):]

def read_contract(contract_path, verbose=False, seen_libs=None, replace=True):
    """Read a Solidity file and recursively expand imported contracts inline.
    """
    if seen_libs is None:
        seen_libs = set()

    # Separate into path and file
    contract_dir, contract_file = os.path.split(contract_path)
    contract_name = contract_file[:-4]

    output_lines = []
    with open(contract_path) as f:
        for line in f:
            if line.startswith('import '):
                lib_name = line[line.find('"')+1:line.rfind('"')]
                lib_path = os.path.join(contract_dir, lib_name)
                if lib_path not in seen_libs:
                    seen_libs.add(lib_path)
                    output_lines.extend(read_contract(lib_path,
                                                      verbose=False,
                                                      seen_libs=seen_libs,
                                                      replace=False))
                    output_lines.append('\n')
                    print("Importing", lib_name)
            elif replace and (line.startswith('contract ' + contract_name) or \
                              line.startswith('function ' + contract_name)):
                output_lines.append(replace_name(contract_name, line))
            else:
                output_lines.append(line)

    if verbose:
        print(''.join(output_lines))
    return output_lines


def deploy_contract(contract_lines):
    """Compile and deploy a contract using truffle with imports expanded inline.
    """
    # Initiate a temporary truffle directory
    with tempfile.TemporaryDirectory() as truffle_dir:
        os.chdir(truffle_dir)
        subprocess.call('truffle init', shell=True)

        # Overwrite Example.sol in the truffle directory
        output_path = os.path.join(truffle_dir, 'contracts', 'Example.sol')
        with open(output_path, 'w') as f:
            f.writelines(contract_lines)
        subprocess.call('truffle deploy', shell=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Compile and deploy contracts.')
    parser.add_argument('contract_path', help='path to .sol file')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='display the final contract')
    args = parser.parse_args()
    deploy_contract(read_contract(args.contract_path, verbose=args.verbose))
